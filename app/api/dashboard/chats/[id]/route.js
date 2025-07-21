import { NextResponse } from "next/server";

// Mock data for admin chat details - matching actual API response structure
const adminChatDetails = {
  1: {
    id: 1,
    created_by: 50,
    name: null,
    image: null,
    is_private: 1,
    created_at: "2025-07-15T16:18:01.000000Z",
    updated_at: "2025-07-17T13:24:24.000000Z",
    last_message: {
      id: 46,
      chat_id: 1,
      user_id: 50,
      message: "like",
      attachments: [], // Array for file attachments
      read_at: "2025-07-17 22:17:36",
      created_at: "2025-07-17T13:24:25.000000Z",
      updated_at: "2025-07-17T22:17:36.000000Z",
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
    messages: [
      {
        id: 1,
        chat_id: 1,
        user_id: 42,
        message: "message 1",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-15T16:18:55.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 15,
        chat_id: 1,
        user_id: 50,
        message: "hi",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-15T18:17:06.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 18,
        chat_id: 1,
        user_id: 42,
        message: "hi",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-15T23:00:21.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 19,
        chat_id: 1,
        user_id: 42,
        message: "last",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-15T23:00:32.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 20,
        chat_id: 1,
        user_id: 42,
        message: "koefkoijoi",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:39:34.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 21,
        chat_id: 1,
        user_id: 42,
        message: "iojij",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:39:44.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 22,
        chat_id: 1,
        user_id: 42,
        message: "last",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:41:20.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 23,
        chat_id: 1,
        user_id: 42,
        message: "eslam",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:42:13.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 24,
        chat_id: 1,
        user_id: 50,
        message: "welcom",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:43:10.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 25,
        chat_id: 1,
        user_id: 50,
        message: "hi",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:43:17.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 26,
        chat_id: 1,
        user_id: 42,
        message: "😍🤩",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:52:04.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 27,
        chat_id: 1,
        user_id: 42,
        message: "🤪",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:52:29.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 28,
        chat_id: 1,
        user_id: 42,
        message: "jij",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:52:41.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 29,
        chat_id: 1,
        user_id: 50,
        message: "like",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:57:07.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 30,
        chat_id: 1,
        user_id: 42,
        message: "agian please",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T11:57:22.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 31,
        chat_id: 1,
        user_id: 50,
        message: "thanks",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T12:00:59.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 32,
        chat_id: 1,
        user_id: 42,
        message: "ok",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T12:01:10.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 33,
        chat_id: 1,
        user_id: 42,
        message: "hello",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T12:01:28.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 34,
        chat_id: 1,
        user_id: 50,
        message: "ok",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T12:01:35.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 35,
        chat_id: 1,
        user_id: 42,
        message: "🤪",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T12:22:25.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 36,
        chat_id: 1,
        user_id: 50,
        message: "😆",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T12:22:17.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 37,
        chat_id: 1,
        user_id: 42,
        message: "like 👍",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T19:33:36.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 38,
        chat_id: 1,
        user_id: 50,
        message: "ازيك",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-16T22:50:20.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 39,
        chat_id: 1,
        user_id: 42,
        message: "hi",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T10:34:27.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 40,
        chat_id: 1,
        user_id: 42,
        message: "again",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T10:34:35.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 41,
        chat_id: 1,
        user_id: 42,
        message: "https://chat.deepseek.com/",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T10:44:58.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 42,
        chat_id: 1,
        user_id: 42,
        message: "https://grok.com/",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T10:53:48.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 43,
        chat_id: 1,
        user_id: 42,
        message: "ok",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T10:55:24.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 44,
        chat_id: 1,
        user_id: 50,
        message: "ok",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T10:56:02.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 45,
        chat_id: 1,
        user_id: 50,
        message: "https://chat.deepseek.com/",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T11:03:36.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 46,
        chat_id: 1,
        user_id: 50,
        message: "like",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T13:24:25.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      }
    ],
    participants: [
      {
        id: 1,
        chat_id: 1,
        user_id: 42,
        created_at: "2025-07-15T16:18:26.000000Z",
        updated_at: "2025-07-15T16:18:26.000000Z",
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
        id: 2,
        chat_id: 1,
        user_id: 50,
        created_at: "2025-07-15T16:18:26.000000Z",
        updated_at: "2025-07-15T16:18:26.000000Z",
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
    ]
  },
  2: {
    id: 2,
    created_by: 51,
    name: null,
    image: null,
    is_private: 1,
    created_at: "2025-07-15T16:18:01.000000Z",
    updated_at: "2025-07-17T13:24:24.000000Z",
    last_message: {
      id: 47,
      chat_id: 2,
      user_id: 51,
      message: "Thank you for the lesson",
      read_at: "2025-07-17 22:17:36",
      created_at: "2025-07-17T13:24:25.000000Z",
      updated_at: "2025-07-17T22:17:36.000000Z",
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
    messages: [
      {
        id: 47,
        chat_id: 2,
        user_id: 51,
        message: "Thank you for the lesson today",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T13:24:25.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      },
      {
        id: 48,
        chat_id: 2,
        user_id: 43,
        message: "You're welcome! You did great today",
        read_at: "2025-07-17 22:17:36",
        created_at: "2025-07-17T13:25:00.000000Z",
        updated_at: "2025-07-17T22:17:36.000000Z"
      }
    ],
    participants: [
      {
        id: 3,
        chat_id: 2,
        user_id: 43,
        created_at: "2025-07-15T16:18:26.000000Z",
        updated_at: "2025-07-15T16:18:26.000000Z",
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
      },
      {
        id: 4,
        chat_id: 2,
        user_id: 51,
        created_at: "2025-07-15T16:18:26.000000Z",
        updated_at: "2025-07-15T16:18:26.000000Z",
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
      }
    ]
  }
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        data: {},
        success: false,
        message: "Chat ID is required"
      }, { status: 400 });
    }

    const chatId = parseInt(id);
    const chatDetails = adminChatDetails[chatId];

    if (!chatDetails) {
      return NextResponse.json({
        data: {},
        success: false,
        message: "Chat not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      data: chatDetails,
      success: true,
      message: "Chat details fetched successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin chat details:", error);
    return NextResponse.json({
      data: {},
      success: false,
      message: "Failed to fetch chat details"
    }, { status: 500 });
  }
} 