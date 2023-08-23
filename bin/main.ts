#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Tagger } from '../lib/aspects';
import { StackA, StackB } from '../lib/stacks';

const app = new cdk.App();

const stackA = new StackA(app, 'StackA', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

const stackB = new StackB(app, 'StackB', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: stackA.vpc,
  securityGroup: stackA.securityGroup,
  securityGroupSSM: stackA.securityGroupSSM,
});

cdk.Aspects.of(stackA).add(new Tagger({
  project: 'cdkday-talk',
  projectVersion: 'v1',
}));

cdk.Aspects.of(stackB).add(new Tagger({
  project: 'cdkday-talk',
  projectVersion: 'v1',
}));
