import { NextResponse } from "next/server";

// Mock data for chat media
const chatMediaData = {
  1: {
    images: [
      {
        id: 1,
        name: "9-01 (1).png",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/3179717529265899-01 (1).png",
        size: "246.43 KB"
      },
      {
        id: 2,
        name: "9-01 (1).png",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/4933517529282479-01 (1).png",
        size: "246.43"
      },
      {
        id: 6,
        name: "9-01 (1).png",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/7819617529306429-01 (1).png",
        size: "252348"
      },
      {
        id: 8,
        name: "Component 237.png",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/804701752932690Component 237.png",
        size: "74751"
      },
      {
        id: 9,
        name: "pubg-4k-m7d01u319yw5wo0m.jpg",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/792801752932892pubg-4k-m7d01u319yw5wo0m.jpg",
        size: "227021"
      },
      {
        id: 10,
        name: "Screenshot 2025-03-10 225555.png",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/531621752933046Screenshot 2025-03-10 225555.png",
        size: "1041378"
      }
    ],
    links: [
      "https://chat.deepseek.com/",
      "https://grok.com/",
      "https://chat.deepseek.com/"
    ],
    files: [
      {
        id: 7,
        name: "4.pdf",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/4235417529309104.pdf",
        size: "679396"
      }
    ]
  },
  2: {
    images: [
      {
        id: 11,
        name: "lesson_notes.jpg",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/lesson_notes.jpg",
        size: "512.00"
      }
    ],
    links: [
      "https://stackoverflow.com/",
      "https://www.envato.com/"
    ],
    files: [
      {
        id: 12,
        name: "study_guide.pdf",
        link: "https://indigo-ferret-819035.hostingersite.com/storage/files/pdf/study_guide.pdf",
        size: "1024.00"
      }
    ]
  }
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        status: 400,
        msg: "Chat ID is required",
        data: null
      }, { status: 400 });
    }

    const chatId = parseInt(id);
    const mediaData = chatMediaData[chatId] || {
      images: [],
      links: [],
      files: []
    };

    return NextResponse.json({
      status: 200,
      msg: "Media fetched successfully",
      data: mediaData
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat media:", error);
    return NextResponse.json({
      status: 500,
      msg: "Failed to fetch media",
      data: null
    }, { status: 500 });
  }
} 