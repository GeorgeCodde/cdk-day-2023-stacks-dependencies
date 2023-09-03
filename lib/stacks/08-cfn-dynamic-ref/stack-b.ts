import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

import { CoreStack } from './stack-a';

export class DemoStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const vpc = CoreStack.getVpc(this, 'Vpc');

    const managementSecurityGroup = CoreStack.getManagementSecurityGroup(this, 'MgmntSG');

    const mySecurityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
    });
    mySecurityGroup.addIngressRule(managementSecurityGroup, ec2.Port.allTraffic());
  }
}
