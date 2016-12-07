import {GraphQLSchema,} from 'graphql';
import {Codegen, Model, CodegenDocument} from './interfaces';
import {GraphQLNamedType, DefinitionNode, DocumentNode, Kind} from "graphql";
import {handleType} from "./model-handler";
import {handleOperation} from "./operation-handler";

export const prepareCodegen = (schema: GraphQLSchema, document: DocumentNode): Codegen => {
  let models: Model[] = [];
  let documents: CodegenDocument[];
  let typesMap: GraphQLNamedType = schema.getTypeMap();

  Object.keys(typesMap).forEach(typeName => {
    models.push(handleType(typeName, typesMap[typeName]));
  });

  documents = document.definitions.map<CodegenDocument>((definition: DefinitionNode) => {
    switch (definition.kind) {
      case Kind.OPERATION_DEFINITION:
        return handleOperation(schema, definition);
      default:
        return null;
    }
  });

  return <Codegen>{
    models,
    documents
  };
};
