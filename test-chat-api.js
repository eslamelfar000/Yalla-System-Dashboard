// Test script to verify chat API functionality
// Run this in browser console or as a test

const testChatAPI = async () => {
  try {
    // Test 1: Send message with text only
    console.log('Test 1: Sending message with text only');
    const formData1 = new FormData();
    formData1.append('message', 'Hello, this is a test message');
    formData1.append('user_id', '42');
    
    const response1 = await fetch('/api/dashboard/chats/1/messages', {
      method: 'POST',
      body: formData1,
    });
    
    const result1 = await response1.json();
    console.log('Test 1 Result:', result1);
    
    // Test 2: Send message with attachments only (no text)
    console.log('Test 2: Sending message with attachments only');
    const formData2 = new FormData();
    formData2.append('message', ''); // Empty message
    formData2.append('user_id', '42');
    // Note: In real test, you would add actual files here
    
    const response2 = await fetch('/api/dashboard/chats/1/messages', {
      method: 'POST',
      body: formData2,
    });
    
    const result2 = await response2.json();
    console.log('Test 2 Result:', result2);
    
    // Test 3: Send message with both text and attachments
    console.log('Test 3: Sending message with text and attachments');
    const formData3 = new FormData();
    formData3.append('message', 'Hello with files');
    formData3.append('user_id', '42');
    // Note: In real test, you would add actual files here
    
    const response3 = await fetch('/api/dashboard/chats/1/messages', {
      method: 'POST',
      body: formData3,
    });
    
    const result3 = await response3.json();
    console.log('Test 3 Result:', result3);
    
    // Test 4: Try to send empty message with no attachments (should fail)
    console.log('Test 4: Sending empty message with no attachments (should fail)');
    const formData4 = new FormData();
    formData4.append('message', '');
    formData4.append('user_id', '42');
    
    const response4 = await fetch('/api/dashboard/chats/1/messages', {
      method: 'POST',
      body: formData4,
    });
    
    const result4 = await response4.json();
    console.log('Test 4 Result:', result4);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
// testChatAPI(); 