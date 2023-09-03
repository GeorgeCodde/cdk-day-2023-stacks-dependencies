import * as fs from 'fs';
import * as path from 'path';
import { IAspect, Tag, Stack } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

import * as cdkPackage from '../../package.json';


interface TaggerProps {
  /**
   * Name of the project vinculated to the resource
   *
   * @default - 'app'
   */
  readonly project?: string;
  /**
   * Version of the project vinculated to the resource
   *
   * @default - 'latest'
   */
  readonly projectVersion?: string;
}

/**
 * CDK Aspect to apply some default tags to all resources in the scope provided
 *
 * @example
 * import { Aspects } from 'aws-cdk-lib';
 * import { Stage } from '../constants';
 *
 * Aspects.of(myStack).add(new Tagger({ stage: Stage.DEV, project: 'test', projectVersion: 'v1'}));
 */
class Tagger implements IAspect {
  private readonly project: string;
  private readonly projectVersion: string;

  constructor(props: TaggerProps) {
    this.project = props.project || 'app';
    this.projectVersion = props.projectVersion || 'latest';
  }

  visit(construct: IConstruct): void {
    const deployType = process.env.DEPLOY_TYPE ? process.env.DEPLOY_TYPE : 'local';
    const stackName = Stack.of(construct).stackName;

    const tags = {
      'env': 'test',
      'deploy:tool': 'cdk',
      'deploy:type': deployType,
      'deploy:tool:version': cdkPackage.dependencies['aws-cdk-lib'],
      'stack:name': stackName,
      'project:name': this.project,
      'project:version': this.projectVersion,
      'git:repository': Tagger.getGitRepository(),
    };

    for (const [tagName, tagValue] of Object.entries(tags)) {
      new Tag(tagName, tagValue).visit(construct);
    }
  }

  private static getGitRepository(): string {
    const data = this.getGitFileContent('config');
    for (const line of data.split('\n')) {
      if (line.includes('url = ')) {
        return line.trim().split(' ')[2];
      }
    }
    return 'No code repo found';
  }

  private static getGitCurrentRef(): string {
    const data = this.getGitFileContent('HEAD');
    return data.replace('\n', '').split(' ')[1];
  }

  private static getGitCurrentCommitId(): string {
    const data = this.getGitFileContent('ORIG_HEAD');
    return data.replace('\n', '');
  }

  private static getGitFileContent(fileName: string): string {
    const gitpath = this.findGitDirectory();
    if (!gitpath) {
      throw new Error('No .git folder found');
    }
    return fs.readFileSync(path.join(gitpath, fileName), 'utf8');
  }

  private static findGitDirectory(): string {
    let currentDir = process.cwd(); // Get the current directory

    while (currentDir !== '/') {
      const gitDir = path.join(currentDir, '.git');

      if (fs.existsSync(gitDir)) {
        return gitDir;
      }

      currentDir = path.dirname(currentDir); // Move up to the parent directory
    }

    return ''; // .git directory not found
  }
}

export {
  Tagger,
  TaggerProps,
}
