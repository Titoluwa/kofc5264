import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
    name: 'KofC 5264',
    title: 'KofC council 5264',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hyy08zta',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

    plugins: [deskTool(), visionTool()],

    schema: {
        types: schemaTypes,
    },
})
