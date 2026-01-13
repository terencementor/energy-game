import React, { useEffect, useState } from 'react'
import { useGame } from '../context/GameContext'
import './Notifications.css'

interface NotificationItem {
  id: string
  message: string
  type: 'info' | 'warning' | 'success'
  timestamp: number
}

const Notifications: React.FC = () => {
  const { gameState } = useGame()
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (gameState.notifications && gameState.notifications.length > 0) {
      // Add new notifications and keep track of visible ones
      const newNotifications = gameState.notifications.slice(-5) // Show last 5 notifications
      setVisibleNotifications(newNotifications)

      // Auto-dismiss notifications after 4 seconds
      const timers = newNotifications.map((notification) => {
        return setTimeout(() => {
          setVisibleNotifications((prev) => prev.filter((n) => n.id !== notification.id))
        }, 4000)
      })

      return () => {
        timers.forEach((timer) => clearTimeout(timer))
      }
    }
  }, [gameState.notifications])

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="notifications-container">
      {visibleNotifications.map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          <div className="notification-message">{notification.message}</div>
        </div>
      ))}
    </div>
  )
}

export default Notifications
