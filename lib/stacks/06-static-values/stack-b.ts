import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

import { CommonStack } from './stack-a';

export class NewServiceStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = CommonStack.getEcsCluster(this, 'MyCluster');

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTask');

    taskDefinition.addContainer('MyApp', {
      image: ecs.RepositoryImage.fromEcrRepository(
        ecr.Repository.fromRepositoryName(this, 'MyAppEcrRepo', 'my-app'),
        'latest',
      ),
    });

    new ecs.FargateService(this, 'MyEcsService', {
      cluster,
      taskDefinition,
      desiredCount: 0,
    });
  }
}
