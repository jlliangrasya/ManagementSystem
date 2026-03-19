import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function NotificationBell() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchUnread() {
    const { data } = await supabase.from('notifications').select('id').eq('read', false)
    setUnread(data?.length || 0)
  }

  if (unread === 0) return null

  return (
    <span style={{
      marginLeft: 'auto',
      background: '#ef4444',
      color: 'white',
      fontSize: 10,
      fontWeight: 800,
      minWidth: 18,
      height: 18,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 4px',
    }}>
      {unread}
    </span>
  )
}
