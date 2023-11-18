export default function TypingAnimation() {
    return (
        <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-300 to-green-300 animate-pulse"></div>
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-300 to-green-300 animate-pulse delay-75"></div>
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-300 to-green-300 animate-pulse delay-150"></div>
        </div>
    )
}