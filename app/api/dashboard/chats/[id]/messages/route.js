import { NextResponse } from "next/server";

// Utility function to validate and process file attachments
const processAttachments = (files) => {
  const processedAttachments = [];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/zip', 'application/rar'
  ];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (file && file.size > 0) {
      // Validate file size
      if (file.size > maxFileSize) {
        throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed.`);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${i}.${fileExtension}`;
      
      // In a real application, you would save the file to storage here
      // For now, we'll simulate the file URL
      const fileUrl = `/storage/chat-attachments/${fileName}`;

      processedAttachments.push({
        id: Date.now() + i,
        uploaded_file: fileUrl, // uploaded file or image URL
        attach_type: file.type, // attach_type
        attach_size: file.size, // attach_size
        attach_name: file.name, // attach_name
        created_at: new Date().toISOString()
      });
    }
  }

  return processedAttachments;
};

// Mock data for admin chat messages - matching actual API response structure
const adminChatMessages = {
  1: [
    {
      id: 1,
      chat_id: 1,
      user_id: 50,
      message: "Hello, how are you?",
      attachments: [], // Array for file attachments (matching real API)
      read_at: null,
      created_at: "2025-07-17T13:24:25.000000Z",
      updated_at: "2025-07-17T13:24:24.000000Z",
      user: {
        id: 50,
        name: "Eslam Student",
        email: "eslamStud@gmail.com",
        phone: "201060376185",
        role: "student",
        status: "active",
        location: null,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_VQvuRo4SyQr1uhvdXwmgJYYX5pj7Yr_qcw&s",
        debt: null,
        review_lesson_price: null,
        coaching_lesson_price: null,
        assiend_teacher_id: 42,
        type: null,
        total_raise: "0",
        total_reduction: "0",
        raise_notes: null,
        reduction_notes: null,
        sessions: 0,
        email_verified_at: null,
        created_at: "2025-07-15T19:24:33.000000Z",
        updated_at: "2025-07-15T19:24:33.000000Z"
      }
    },
    {
      id: 2,
      chat_id: 1,
      user_id: 42,
      message: "I'm doing well, thank you! How about you?",
      attachments: [], // Array for file attachments (matching real API)
      read_at: null,
      created_at: "2025-07-17T13:25:00.000000Z",
      updated_at: "2025-07-17T13:25:00.000000Z",
      user: {
        id: 42,
        name: "Eslam EL-Far8777",
        email: "eslam5saber707@gmail.com",
        phone: "01060373175",
        role: "teacher",
        status: "active",
        location: null,
        image: "/storage/files/6877c61cc3ef0_1752679964.jpg",
        debt: 45,
        review_lesson_price: null,
        coaching_lesson_price: null,
        assiend_teacher_id: null,
        type: null,
        total_raise: "0",
        total_reduction: "0",
        raise_notes: null,
        reduction_notes: null,
        sessions: 0,
        email_verified_at: null,
        created_at: "2025-06-14T14:09:07.000000Z",
        updated_at: "2025-07-16T15:32:44.000000Z"
      }
    },
    {
      id: 3,
      chat_id: 1,
      user_id: 50,
      message: "I'm good too. Can we schedule our next lesson?",
      attachments: [], // Array for file attachments (matching real API)
      read_at: null,
      created_at: "2025-07-17T13:26:00.000000Z",
      updated_at: "2025-07-17T13:26:00.000000Z",
      user: {
        id: 50,
        name: "Eslam Student",
        email: "eslamStud@gmail.com",
        phone: "201060376185",
        role: "student",
        status: "active",
        location: null,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_VQvuRo4SyQr1uhvdXwmgJYYX5pj7Yr_qcw&s",
        debt: null,
        review_lesson_price: null,
        coaching_lesson_price: null,
        assiend_teacher_id: 42,
        type: null,
        total_raise: "0",
        total_reduction: "0",
        raise_notes: null,
        reduction_notes: null,
        sessions: 0,
        email_verified_at: null,
        created_at: "2025-07-15T19:24:33.000000Z",
        updated_at: "2025-07-15T19:24:33.000000Z"
      }
    },
    {
      id: 4,
      chat_id: 1,
      user_id: 42,
      message: "Here are some study materials",
      attachments: [
        {
          id: 1,
          type: "pdf",
          name: "study_guide.pdf",
          size: "1024.00",
          link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/study_guide.pdf"
        },
        {
          id: 2,
          type: "image",
          name: "lesson_notes.jpg",
          size: "512.00",
          link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/lesson_notes.jpg"
        }
      ],
      read_at: null,
      created_at: "2025-07-17T13:27:00.000000Z",
      updated_at: "2025-07-17T13:27:00.000000Z",
      user: {
        id: 42,
        name: "Eslam EL-Far8777",
        email: "eslam5saber707@gmail.com",
        phone: "01060373175",
        role: "teacher",
        status: "active",
        location: null,
        image: "/storage/files/6877c61cc3ef0_1752679964.jpg",
        debt: 45,
        review_lesson_price: null,
        coaching_lesson_price: null,
        assiend_teacher_id: null,
        type: null,
        total_raise: "0",
        total_reduction: "0",
        raise_notes: null,
        reduction_notes: null,
        sessions: 0,
        email_verified_at: null,
        created_at: "2025-06-14T14:09:07.000000Z",
        updated_at: "2025-07-16T15:32:44.000000Z"
      }
    },
    {
      id: 52,
      chat_id: 1,
      user_id: 42,
      message: "hello بيللي",
      attachments: [
        {
          id: 3,
          type: "image",
          name: "9-01 (1).png",
          size: "246.43",
          link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/5946217529297099-01 (1).png"
        }
      ],
      read_at: null,
      created_at: "2025-07-19T15:53:35.000000Z",
      updated_at: "2025-07-19T12:55:09.000000Z",
      user: {
        id: 42,
        name: "Eslam EL-Far8777",
        email: "eslam5saber707@gmail.com",
        phone: "01060373190",
        role: "teacher",
        provider_id: "",
        image: "https://indigo-ferret-819035.hostingersite.com/storage/files/6877c61cc3ef0_1752679964.jpg",
        device_token: "",
        email_verified_at: "",
        location: "Egypt/Damietta",
        join_at: "2025-06-14T14:09:07.000000Z",
        status: "active",
        review_lesson_price: null,
        coaching_lesson_price: null,
        debt: 45,
        assiend_teacher: null,
        sessions: 0,
        type: null,
        teacher: {
          id: 11,
          user_id: 42,
          position: null,
          languages: null,
          lession_price: 45,
          about_me: null,
          about_course: null,
          certificate: null,
          target: 40,
          debt: 45,
          is_new: 1,
          pay_after_lesson_price: 45,
          pay_before_lesson_price: 45,
          package_after_price: 45,
          package_before_price: 45,
          total_raise: null,
          total_reduction: null,
          raise_notes: null,
          reduction_notes: null,
          video_link: null,
          created_at: "2025-06-14T14:09:07.000000Z",
          updated_at: "2025-07-04T16:21:30.000000Z"
        },
        sessions_count: 0,
        sessions_count_done: 0,
        sessions_count_current: 0,
        current_sessions: [],
        compelete_sessions: []
      }
    },
    {
      id: 53,
      chat_id: 1,
      user_id: 50,
      message: "Here are some documents",
      attachments: [
        {
          id: 4,
          type: "pdf",
          name: "study_guide.pdf",
          size: "1024.00",
          link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/study_guide.pdf"
        },
        {
          id: 5,
          type: "image",
          name: "homework_screenshot.png",
          size: "256.00",
          link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/homework_screenshot.png"
        }
      ],
      read_at: null,
      created_at: "2025-07-17T13:28:00.000000Z",
      updated_at: "2025-07-17T13:28:00.000000Z",
      user: {
        id: 50,
        name: "Eslam Student",
        email: "eslamStud@gmail.com",
        phone: "201060376185",
        role: "student",
        status: "active",
        location: null,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_VQvuRo4SyQr1uhvdXwmgJYYX5pj7Yr_qcw&s",
        debt: null,
        review_lesson_price: null,
        coaching_lesson_price: null,
        assiend_teacher_id: 42,
        type: null,
        total_raise: "0",
        total_reduction: "0",
        raise_notes: null,
        reduction_notes: null,
        sessions: 0,
        email_verified_at: null,
        created_at: "2025-07-15T19:24:33.000000Z",
        updated_at: "2025-07-15T19:24:33.000000Z"
      }
    }
  ],
  2: [
    {
      id: 5,
      chat_id: 2,
      user_id: 51,
      message: "Thank you for the lesson today",
      attachments: [], // Array for file attachments (matching real API)
      read_at: null,
      created_at: "2025-07-17T13:24:25.000000Z",
      updated_at: "2025-07-17T13:24:24.000000Z",
      user: {
        id: 51,
        name: "Fatima Student",
        email: "fatima@gmail.com",
        phone: "201060376186",
        role: "student",
        status: "active",
        location: null,
        image: "/images/avatar/avatar-3.jpg",
        debt: null,
        review_lesson_price: null,
        coaching_lesson_price: null,
        assiend_teacher_id: 43,
        type: null,
        total_raise: "0",
        total_reduction: "0",
        raise_notes: null,
        reduction_notes: null,
        sessions: 0,
        email_verified_at: null,
        created_at: "2025-07-15T19:24:33.000000Z",
        updated_at: "2025-07-15T19:24:33.000000Z"
      }
    },
    {
      id: 6,
      chat_id: 2,
      user_id: 43,
      message: "You're welcome! You did great today",
      attachments: [], // Array for file attachments (matching real API)
      read_at: null,
      created_at: "2025-07-17T13:25:00.000000Z",
      updated_at: "2025-07-17T13:25:00.000000Z",
      user: {
        id: 43,
        name: "Michael Teacher",
        email: "michael@gmail.com",
        phone: "01060373176",
        role: "teacher",
        status: "active",
        location: null,
        image: "/images/avatar/avatar-4.jpg",
        debt: 30,
        review_lesson_price: null,
        coaching_lesson_price: null,
        assiend_teacher_id: null,
        type: null,
        total_raise: "0",
        total_reduction: "0",
        raise_notes: null,
        reduction_notes: null,
        sessions: 0,
        email_verified_at: null,
        created_at: "2025-06-14T14:09:07.000000Z",
        updated_at: "2025-07-16T15:32:44.000000Z"
      }
    }
  ]
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = 20;
    
    if (!id) {
      return NextResponse.json({
        data: [],
        success: false,
        message: "Chat ID is required"
      }, { status: 400 });
    }

    const chatId = parseInt(id);
    const messages = adminChatMessages[chatId] || [];

    // Paginate the messages
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMessages = messages.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedMessages,
      success: true,
      message: "Messages fetched successfully",
      pagination: {
        current_page: page,
        last_page: Math.ceil(messages.length / pageSize),
        total: messages.length,
        per_page: pageSize,
        has_more: endIndex < messages.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin chat messages:", error);
    return NextResponse.json({
      data: [],
      success: false,
      message: "Failed to fetch messages"
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Chat ID is required"
      }, { status: 400 });
    }

    const chatId = parseInt(id);
    
    // Handle multipart form data for file uploads
    const formData = await request.formData();
    const message = formData.get('message') || '';
    const userId = formData.get('user_id');
    const attachments = formData.getAll('attachments'); // Get all files

    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required"
      }, { status: 400 });
    }

    // Check if message is provided or if there are attachments
    if (!message.trim() && attachments.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Message text or attachments are required"
      }, { status: 400 });
    }

    // Require message when sending attachments
    if (attachments.length > 0 && !message.trim()) {
      return NextResponse.json({
        success: false,
        message: "Please add a message when sending files or images"
      }, { status: 400 });
    }

    // Process attachments using utility function
    let processedAttachments = [];
    try {
      processedAttachments = processAttachments(attachments);
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 });
    }

    // Create new message
    const newMessage = {
      id: Date.now(),
      chat_id: chatId,
      user_id: parseInt(userId),
      message: message.trim(),
      attachments: processedAttachments.map(att => ({
        id: att.id,
        type: att.attach_type.startsWith('image/') ? 'image' : 'pdf',
        name: att.attach_name,
        size: (att.attach_size / 1024).toFixed(2),
        link: att.uploaded_file
      })),
      read_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: parseInt(userId),
        name: "Current User",
        email: "user@example.com",
        role: "student",
        image: "/images/avatar/default.jpg"
      }
    };

    // Add message to mock data
    if (!adminChatMessages[chatId]) {
      adminChatMessages[chatId] = [];
    }
    adminChatMessages[chatId].push(newMessage);

    return NextResponse.json({
      data: newMessage,
      success: true,
      message: "Message sent successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to send message"
    }, { status: 500 });
  }
} 