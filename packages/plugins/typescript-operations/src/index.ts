import { PluginFunction, Types } from 'graphql-codegen-plugin-helpers';
import { visit, concatAST, GraphQLSchema } from 'graphql';
import { TypeScriptDocumentsVisitor } from './visitor';
import { RawDocumentsConfig } from 'graphql-codegen-visitor-plugin-common';

export interface TypeScriptDocumentsPluginConfig extends RawDocumentsConfig {
  avoidOptionals?: boolean;
  immutableTypes?: boolean;
}

export const plugin: PluginFunction<TypeScriptDocumentsPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: TypeScriptDocumentsPluginConfig
) => {
  const allAst = concatAST(
    documents.reduce((prev, v) => {
      return [...prev, v.content];
    }, [])
  );

  const visitorResult = visit(allAst, {
    leave: new TypeScriptDocumentsVisitor(schema, config)
  });

  return visitorResult.definitions.join('\n');
};
