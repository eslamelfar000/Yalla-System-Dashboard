// Chat utility functions for handling file attachments

/**
 * Send a message with attachments to the chat API
 * @param {string} chatId - The chat ID
 * @param {string} message - The message text
 * @param {Array} attachments - Array of File objects
 * @param {string} userId - The user ID
 * @returns {Promise} - API response
 */
export const sendMessageWithAttachments = async (chatId, message, attachments = [], userId) => {
  try {
    const formData = new FormData();
    
    // Add basic message data - allow empty message if attachments are present
    formData.append('message', message || '');
    formData.append('user_id', userId);
    
    // Add file attachments
    attachments.forEach((file, index) => {
      if (file instanceof File) {
        formData.append('attachments', file);
      }
    });

    const response = await fetch(`/api/dashboard/chats/${chatId}/messages`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send message');
    }

    return result;
  } catch (error) {
    console.error('Error sending message with attachments:', error);
    throw error;
  }
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result
 */
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/zip', 'application/rar'
  ];

  const errors = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File ${file.name} is too large. Maximum size is 10MB.`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed for ${file.name}.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Create a preview URL for images
 * @param {File} file - The image file
 * @returns {string} - Preview URL
 */
export const createImagePreview = (file) => {
  if (file && file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  return null;
};

/**
 * Clean up preview URLs to prevent memory leaks
 * @param {Array} attachments - Array of attachment objects with preview URLs
 */
export const cleanupPreviews = (attachments) => {
  attachments.forEach(attachment => {
    if (attachment.preview && attachment.preview.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.preview);
    }
  });
};

/**
 * Prepare attachments for upload
 * @param {Array} files - Array of File objects
 * @returns {Array} - Processed attachments
 */
export const prepareAttachments = (files) => {
  return files.map(file => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    return {
      file,
      attach_name: file.name,
      attach_size: file.size,
      attach_type: file.type,
      preview: createImagePreview(file)
    };
  });
};

/**
 * Process attachment data from API response
 * @param {Object} attachment - Attachment object from API
 * @returns {Object} - Processed attachment for display
 */
export const processAttachmentData = (attachment) => {
  return {
    id: attachment.id,
    type: attachment.type,
    name: attachment.name,
    size: attachment.size,
    link: attachment.link
  };
};

/**
 * Check if attachment is an image
 * @param {string} type - The type from attachment
 * @returns {boolean} - True if image
 */
export const isImageAttachment = (type) => {
  return type === 'image';
};

/**
 * Get attachment display name
 * @param {Object} attachment - Attachment object
 * @returns {string} - Display name
 */
export const getAttachmentDisplayName = (attachment) => {
  return attachment.name || attachment.attach_name || 'Unknown file';
};

/**
 * Get attachment size for display
 * @param {Object} attachment - Attachment object
 * @returns {string} - Formatted size
 */
export const getAttachmentSize = (attachment) => {
  const size = attachment.size || attachment.attach_size || 0;
  if (typeof size === 'string') {
    return size + ' KB';
  }
  return formatFileSize(size);
};

/**
 * Get attachment type for display
 * @param {Object} attachment - Attachment object
 * @returns {string} - File type
 */
export const getAttachmentType = (attachment) => {
  return attachment.type || attachment.attach_type || 'unknown';
};

/**
 * Get file icon based on file type
 * @param {string} type - Type of the file
 * @returns {string} - Icon name
 */
export const getFileIcon = (type) => {
  if (type === 'image') {
    return 'tabler:photo';
  } else if (type === 'pdf') {
    return 'tabler:file-type-pdf';
  } else if (type.includes('word') || type.includes('document')) {
    return 'tabler:file-type-docx';
  } else if (type === 'text') {
    return 'tabler:file-type-txt';
  } else if (type.includes('zip') || type.includes('rar')) {
    return 'tabler:file-zip';
  } else {
    return 'tabler:file';
  }
}; 