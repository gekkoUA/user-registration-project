import type { Schema, Struct } from '@strapi/strapi';

export interface SharedEducation extends Struct.ComponentSchema {
  collectionName: 'components_shared_educations';
  info: {
    displayName: 'Education';
    icon: 'clock';
  };
  attributes: {
    college: Schema.Attribute.String & Schema.Attribute.Required;
    degree: Schema.Attribute.String & Schema.Attribute.Required;
    graduationYear: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.education': SharedEducation;
    }
  }
}
