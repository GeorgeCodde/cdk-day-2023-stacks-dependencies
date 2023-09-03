import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

export class CommonStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      vpcName: 'cdk-day-vpc',
    });

    new ecs.Cluster(this, 'MyEcsCluster', {
      clusterName: CommonStack.getEcsClusterName(),
      vpc,
    });
  }

  private static getEcsClusterName(): string {
    return 'cdk-day-cluster';
  }

  public static getEcsCluster(scope: Construct, id: string): ecs.ICluster {
    const vpc = ec2.Vpc.fromLookup(scope, `${id}Vpc`, {
      vpcName: 'cdk-day-vpc',
    });

    return ecs.Cluster.fromClusterAttributes(scope, id, {
      clusterName: this.getEcsClusterName(),
      vpc,
    });
  }
}
