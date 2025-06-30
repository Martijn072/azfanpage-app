
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const APACHE_SERVER_URL = 'https://your-apache-server.com/upload.php' // Update with your server URL

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📤 Media upload request received')
    
    const formData = await req.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const caption = formData.get('caption') as string
    const hashtags = formData.get('hashtags') as string
    
    if (!file || !userId) {
      return new Response(
        JSON.stringify({ error: 'File and userId are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
    const maxSize = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 50 * 1024 * 1024 // 5MB for images, 50MB for videos
    
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPG, PNG, WebP, MP4, WebM allowed.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create form data for Apache server
    const apacheFormData = new FormData()
    apacheFormData.append('file', file)
    apacheFormData.append('userId', userId)
    
    // Upload to Apache server
    console.log('🚀 Uploading to Apache server...')
    const uploadResponse = await fetch(APACHE_SERVER_URL, {
      method: 'POST',
      body: apacheFormData
    })
    
    if (!uploadResponse.ok) {
      throw new Error(`Apache server error: ${uploadResponse.status}`)
    }
    
    const uploadResult = await uploadResponse.json()
    console.log('✅ Upload successful:', uploadResult)
    
    // Return the file URLs and metadata
    return new Response(
      JSON.stringify({
        success: true,
        file_url: uploadResult.file_url,
        thumbnail_url: uploadResult.thumbnail_url,
        filename: uploadResult.filename,
        original_filename: file.name,
        file_size: file.size,
        file_type: file.type.startsWith('image/') ? 'image' : 'video',
        caption: caption || null,
        hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('❌ Upload error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Upload failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
