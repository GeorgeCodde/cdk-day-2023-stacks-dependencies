import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class StackA extends cdk.Stack {
  public readonly db: rds.IDatabaseInstance;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      vpcName: 'cdk-day-vpc',
    });

    this.db = new rds.DatabaseInstance(this, 'MyDb', {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      vpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
