# CDK Day 2023 - Inter-stack dependencies strategies in CDK

- [CDK Day 2023 - Inter-stack dependencies strategies in CDK](#cdk-day-2023---inter-stack-dependencies-strategies-in-cdk)
  - [Contents](#contents)
  - [How to use](#how-to-use)
  - [References](#references)

Repository containing code used for the CDK Day 2023 talk "Inter-stack dependencies strategies in CDK".

## Contents

The repository contains a CDK application with some commented code in the main file while have different examples in multiple subfolders in the `lib/` folder. Here is the folders diostribution:

```shell
.
├── bin
└── lib
    ├── aspects
    └── stacks
        ├── 01-basic-example
        ├── 02-db-example
        ├── 03-cloudfront-example
        ├── 04-alb-example
        ├── 05-manual-export
        ├── 06-static-values
        ├── 07-ssm-params
        └── 08-cfn-dynamic-ref
```

Where the `bin/main.ts` file contains the main CDK application program and each of the subfolders contain a `stack-a.ts` and `stack-b.ts` files with the represented example code for each case.

## How to use

In order to use any of the examples you just need to go to the `bin/main.ts` file and move from the desired example commented section.

## References

- [AWS CDK official docs](https://docs.aws.amazon.com/cdk/api/v2/)
- [CloudFormation outputs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html)
- [CloudFormation import values](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html)
- [CloudFormation stack parameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html)
- [CloudFormation dynamic references](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html)
