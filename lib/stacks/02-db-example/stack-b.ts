import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

interface StackBProps extends cdk.StackProps {
  db: rds.IDatabaseInstance;
}

export class StackB extends cdk.Stack {

  constructor(scope: Construct, id: string, props: StackBProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'MyEcsCluster', {
      vpc: ec2.Vpc.fromLookup(this, 'MyVpc', {
        vpcName: 'cdk-day-vpc',
      }),
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTask');

    taskDefinition.addContainer('MyApp', {
      image: ecs.RepositoryImage.fromEcrRepository(
        ecr.Repository.fromRepositoryName(this, 'MyAppEcrRepo', 'my-app'),
        'latest',
      ),
      environment: {
        DB_ENDPOINT: props.db.dbInstanceEndpointAddress,
      },
    });

    new ecs.FargateService(this, 'MyEcsService', {
      cluster,
      taskDefinition,
      desiredCount: 0,
    });
  }
}
