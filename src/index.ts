import { Probot } from "probot";
import { parse, stringify } from "yaml";
import { GitopsRelease, HelmRelease, ChangeRequest } from "./types";
import { findInTreeByFileName } from "./util";

export = (app: Probot) => {
  app.on(["pull_request.opened", "pull_request.reopened", "pull_request.edited"], async (context) => {
    const helmRelease = await getHelmRelease(context);
    const gitopsRelease = await getGitopsRelease(context, helmRelease);
    const changeRequest = await createChangeRequest(context, helmRelease, gitopsRelease);
    await writeComment(context, helmRelease, gitopsRelease, changeRequest);
  })
};

const writeComment = async (context: any, helmRelease: HelmRelease, gitopsRelease: GitopsRelease, changeRequest: ChangeRequest): Promise<void> => {
    if (!changeRequest.updated) return;
    await context.octokit.issues.createComment({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: context.payload.pull_request.number,
      body: `Click to update Helm chart ${helmRelease.name} to [version ${helmRelease.version}](https://github.com/${context.payload.repository.owner.login}/${gitopsRelease.repository}/compare/${changeRequest.branch}?expand=1)`,
    });
};

const createChangeRequest = async (context: any, helmRelease: HelmRelease, gitopsRelease: GitopsRelease): Promise<ChangeRequest> => {
    const gitopsBlob = await context.octokit.git.getBlob({
      owner: context.payload.repository.owner.login,
      repo: gitopsRelease.repository,
      file_sha: gitopsRelease.file,
    });
    const buff = Buffer.from(gitopsBlob.data.content, 'base64').toString('ascii')
    const releaseYaml = parse(buff);

    // check if release is already up to date
    if (releaseYaml.spec.chart.spec.version === helmRelease.version) {
      console.info("Release already up to date");
      return {
        branch: "",
        updated: false,
      }
    }

    releaseYaml.spec.chart.spec.version = helmRelease.version;
    const blob = Buffer.from(stringify(releaseYaml)).toString('base64');
    // create branch
    const prBranch = `feature/${helmRelease.name}-${helmRelease.version}`;
    const branch = await context.octokit.git.createRef({
      owner: context.payload.repository.owner.login,
      repo: gitopsRelease.repository,
      ref: `refs/heads/${prBranch}`,
      sha: gitopsRelease.main,
    });
    await context.octokit.repos.createOrUpdateFileContents({
      owner: context.payload.repository.owner.login,
      repo: gitopsRelease.repository,
      path: gitopsRelease.path,
      content: blob,
      message: `chore: update helm chart ${helmRelease.name} to ${helmRelease.version}`,
      encoding: "utf-8",
      sha: gitopsRelease.file,
      branch: branch.data.ref, 
    });
    return {
      branch: prBranch,
      updated: true,
    }
  }

const getHelmRelease = async (context: any): Promise<HelmRelease> => {
    const diff = await context.octokit.repos.compareCommitsWithBasehead({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      basehead: `${context.payload.pull_request.base.sha}...${context.payload.pull_request.head.sha}`,
    });
    for (const file of diff.data.files) {
      console.log(file);
    }
    const tree = await context.octokit.git.getTree({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      tree_sha: context.payload.pull_request.head.sha,
      recursive: "true",
    });
    const chart = findInTreeByFileName(tree.data.tree, (x) => x ? x.includes("Chart.yaml") : false);
    const chartBlob = await context.octokit.git.getBlob({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      file_sha: chart.sha,
    });
    const buff = Buffer.from(chartBlob.data.content, 'base64').toString('ascii')
    const chartYaml = parse(buff);
    return {
      name: chartYaml['name'],
      version: chartYaml['version'],
      repository: chartYaml['annotations']['acme.org/gitops'],
    };
}

const getGitopsRelease = async (context: any, helmRelease: HelmRelease): Promise<GitopsRelease> => {
    const owner = context.payload.repository.owner.login;
    const repo = helmRelease.repository.split("/")[4];
    const branch = await context.octokit.repos.getBranch({
      owner: context.payload.repository.owner.login,
      repo,
      branch: 'main'
    })
    const gitopsTree = await context.octokit.git.getTree({
      owner: context.payload.repository.owner.login,
      repo: repo,
      tree_sha: branch.data.commit.sha,
      recursive: "true",
    });
    let release = findInTreeByFileName(gitopsTree.data.tree,
      (x) => x ? `https://github.com/${owner}/${repo}/blob/main/${x}` === helmRelease.repository : false); 

    if (!release.sha || !release.path) throw new Error("Release not found");

    return {
      repository: repo,
      main: branch.data.commit.sha,
      file: release.sha,
      path: release.path,
    };
}
