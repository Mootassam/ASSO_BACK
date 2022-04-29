/**
 * Storage permissions.
 *
 * @id - Used to identify the rule on permissions and upload.
 * @folder - Folder where the files will be saved
 * @maxSizeInBytes - Max allowed size in bytes
 * @bypassWritingPermissions - Does not validate if the user has permission to write
 * @publicRead - The file can be publicly accessed via the URL without the need for a signed token
 */
export default class Storage {
  static get values() {
    return {
      userAvatarsProfiles: {
        id: 'userAvatarsProfiles',
        folder: 'user/avatars/profile/:userId',
        maxSizeInBytes: 10 * 1024 * 1024,
        bypassWritingPermissions: true,
        publicRead: true,
      },
      settingsLogos: {
        id: 'settingsLogos',
        folder: 'tenant/:tenantId/settings/logos',
        maxSizeInBytes: 10 * 1024 * 1024,
        publicRead: true,
      },
      settingsBackgroundImages: {
        id: 'settingsBackgroundImages',
        folder:
          'tenant/:tenantId/settings/backgroundImages',
        maxSizeInBytes: 10 * 1024 * 1024,
        publicRead: true,
      },
      electionPv: {
        id: 'electionPv',
        folder: 'tenant/:tenantId/election/pv',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      associationLogo: {
        id: 'associationLogo',
        folder: 'tenant/:tenantId/association/logo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      categoryPhoto: {
        id: 'categoryPhoto',
        folder: 'tenant/:tenantId/category/photo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      brandsPhoto: {
        id: 'brandsPhoto',
        folder: 'tenant/:tenantId/brands/photo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      galleryPhotos: {
        id: 'galleryPhotos',
        folder: 'tenant/:tenantId/gallery/photos',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      productPhoto: {
        id: 'productPhoto',
        folder: 'tenant/:tenantId/product/photo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      productFile: {
        id: 'productFile',
        folder: 'tenant/:tenantId/product/file',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      cartPhoto: {
        id: 'cartPhoto',
        folder: 'tenant/:tenantId/cart/photo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      paymentsettingsPhoto: {
        id: 'paymentsettingsPhoto',
        folder: 'tenant/:tenantId/paymentsettings/photo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      newsImage: {
        id: 'newsImage',
        folder: 'tenant/:tenantId/news/image',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      newsAttachements: {
        id: 'newsAttachements',
        folder: 'tenant/:tenantId/news/attachements',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      partnerLogo: {
        id: 'partnerLogo',
        folder: 'tenant/:tenantId/partner/logo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      groupLogo: {
        id: 'groupLogo',
        folder: 'tenant/:tenantId/group/logo',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      membershipAttachements: {
        id: 'membershipAttachements',
        folder: 'tenant/:tenantId/membership/attachements',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
    };
  }
}
