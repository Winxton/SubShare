
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = ''
const SUPABASE_ANON_KEY = ''

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
