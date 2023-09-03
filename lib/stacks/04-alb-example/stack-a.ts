import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as alb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export class AlbStack extends cdk.Stack {
  public readonly ecsCluster: ecs.ICluster;
  public readonly albListener: alb.IApplicationListener;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'MyVpc', {
      vpcName: 'cdk-day-vpc',
    });

    this.ecsCluster = new ecs.Cluster(this, 'MyEcsCluster', {
      vpc,
    });

    const loadBalancer = new alb.ApplicationLoadBalancer(this, 'MyAlb', {
      vpc,
    });

    this.albListener = loadBalancer.addListener('default', {
      port: 80,
      defaultAction: alb.ListenerAction.fixedResponse(400, {
        messageBody: 'You must use a service path',
      }),
    });
  }
}
