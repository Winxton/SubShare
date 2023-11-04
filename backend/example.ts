
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://vevmecjipzmcuntimfrh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldm1lY2ppcHptY3VudGltZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODA5NzcyNCwiZXhwIjoyMDEzNjczNzI0fQ.jtLcWLQjThi0M78kOspkfZQ2tjVRYBgwkeK-zNctOm0'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function fetchData() {
    let { data, error } = await supabase
        .from('User')
        .select('*')

    if (error) {
        console.error('Error: ', error)
    }
    else {
        console.log('Data: ', data)
    }
}

fetchData()
