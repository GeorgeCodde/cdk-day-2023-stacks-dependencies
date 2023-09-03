import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

import { NetworkStack } from './stack-a';

export class ApplicationStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const vpc = NetworkStack.getVpc(this, 'Vpc');

    const managementSecurityGroup = NetworkStack.getManagementSecurityGroup(this, 'MgmntSG');

    const mySecurityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
    });
    mySecurityGroup.addIngressRule(managementSecurityGroup, ec2.Port.allTraffic());
  }
}
