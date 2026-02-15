import { type SchemaTypeDefinition } from 'sanity'
import {eventType} from './event'

export const schemaTypes = [eventType]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
}