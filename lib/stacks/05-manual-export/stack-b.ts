import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface ImportingStackProps extends cdk.StackProps {
  vpcId: cdk.CfnOutput;
}

export class ImportingStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: ImportingStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'MyVpc', {
      vpcId: props.vpcId.importValue,
      availabilityZones: [
        'eu-west-1a',
        'eu-west-1b',
        'eu-west-1c',
      ],
    });
    const mgmntSg = ec2.SecurityGroup.fromSecurityGroupId(this, 'MgmntSG',
      cdk.Fn.importValue('CDKDayManagementSecurityGroupId'),
    );

    const mySecurityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
    });

    mySecurityGroup.addIngressRule(mgmntSg, ec2.Port.allTraffic());
  }
}
