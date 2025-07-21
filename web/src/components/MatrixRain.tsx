"use client"

import { useEffect, useRef } from "react"

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Matrix characters
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?"
        const charArray = chars.split("")

        // Rain drops
        const drops: number[] = []
        const fontSize = 14
        const columns = Math.floor(canvas.width / fontSize)

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = 1
        }

        // Animation
        const draw = () => {
            // Semi-transparent black background for fade effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Green text
            ctx.fillStyle = "#00ff00"
            ctx.font = `${fontSize}px monospace`

            // Draw characters
            for (let i = 0; i < drops.length; i++) {
                const text =
                    charArray[Math.floor(Math.random() * charArray.length)]
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                // Reset drop to top when it reaches bottom
                if (
                    drops[i] * fontSize > canvas.height &&
                    Math.random() > 0.975
                ) {
                    drops[i] = 0
                }

                drops[i]++
            }
        }

        const interval = setInterval(draw, 50)

        return () => {
            clearInterval(interval)
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className='w-full h-full'
            style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
        />
    )
}
