# CDK Day 2023 - Inter-stack dependencies strategies in CDK

- [CDK Day 2023 - Inter-stack dependencies strategies in CDK](#cdk-day-2023---inter-stack-dependencies-strategies-in-cdk)
  - [Types of dependencies](#types-of-dependencies)
  - [Dependency problematic situations](#dependency-problematic-situations)
    - [Remove an unused exported value](#remove-an-unused-exported-value)
    - [Update the value of an exported value](#update-the-value-of-an-exported-value)

Repository containing code used for the CDK Day 2023 talk "Inter-stack dependencies strategies in CDK".

## Types of dependencies

According to the value:

- Deterministic values - those whose values can be inferred or composed with already know values, like names (e.g. IAM role ARN)
- Non deterministic values - those whose values cannot be inferred because are AWS provided "random" IDs or composed by AWS provided "random" IDs (e.g. security groups IDs)

According to the blast radius:

- Inherit - resources in `stackB` are created from exported values from `stackA` (e.g. S3 Bucket)
- Reflective - resources in `stackB` are created from exported values from `stackA` and resources in `stackA` can be also created by usage of exported values in `stackB` (e.g. add targets to an ALB listener)

## Dependency problematic situations

Creation is not an issue in most of the cases, we just provide the desired values from one stack to another and "the magic" happens. Problems appear when we have to change something in that dependencies, either if we want to remove a no longer used dependency or if we want to change the value of the "shared" value between stacks.

### Remove an unused exported value

**Affects**:

- Deterministic values
- Non deterministic values

E.g. security group from `stackA` that is used in `stackB`.

CDK will naturally follow the stacks dependency tree order to apply changes but exported value in `stackA` cannot be removed since it’s used in `stackB`.

### Update the value of an exported value

**Affects**:

- Deterministic values
- Non deterministic values

E.g. security group from `stackA` that is used in `stackB`.

CDK will naturally follow the stacks dependency tree order to apply changes but exported value in stackA cannot be updated since it’s used in `stackB` and can happen that CloudFormation is unable to know if stackB needs to update/remove/delete the usage of that value.

In this case we can even run into a situation where we cannot update stackB independently without removing any reference to the old value first, which can be problematic or even unacceptable.
