import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

interface StackBProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
  securityGroupSSM: ssm.IStringParameter;
}

export class StackB extends cdk.Stack {

  constructor(scope: Construct, id: string, props: StackBProps) {
    super(scope, id, props);

    new ssm.StringParameter(this, 'MyVPCIDParameter', {
      parameterName: '/test/cdk-day/vpc/id',
      description: 'Parameter containing VPC ID',
      stringValue: props.vpc.vpcId,
    });

    // const importedSSMParameter = ssm.StringParameter.fromStringParameterAttributes(this, 'MyImportedParameter', {
    //   parameterName: props.securityGroupSSM.parameterName,
    //   simpleName: true,
    // });

    const importedSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'MyImportedSecurityGroup',
      // importedSSMParameter.stringValue,
      props.securityGroupSSM.stringValue,
      // props.securityGroup.securityGroupId,
    );
    importedSecurityGroup.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(1234), 'Test new rule');

    // new cdk.CfnOutput(this, 'MyCustomOutput', {
    //   exportName: 'MyCustomOutput',
    //   value: props.securityGroupSSM.parameterName,
    //   description: 'Custom export',
    // });
  }
}
