"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Context to manage image loading state
interface AvatarContextValue {
  isImageLoaded: boolean
  setIsImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const AvatarContext = React.createContext<AvatarContextValue>({
  isImageLoaded: false,
  setIsImageLoaded: () => undefined,
})

// Avatar component
type AvatarProps = React.HTMLAttributes<HTMLDivElement>

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false)

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = React.useMemo(
      () => ({ isImageLoaded, setIsImageLoaded }),
      [isImageLoaded]
    )

    return (
      <AvatarContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="avatar"
          className={cn(
            "relative flex size-8 shrink-0 overflow-hidden rounded-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AvatarContext.Provider>
    )
  }
)
Avatar.displayName = "Avatar"

// AvatarImage component
interface AvatarImageProps extends Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src'> {
  src?: string | null
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = "", onLoadingStatusChange, ...props }, ref) => {
    const { setIsImageLoaded } = React.useContext(AvatarContext)

    // Check if src is valid before rendering
    React.useEffect(() => {
      if (!src) {
        setIsImageLoaded(false)
        onLoadingStatusChange?.("error")
      }
    }, [src, setIsImageLoaded, onLoadingStatusChange])

    if (!src) return null

    return (
      <Image
        ref={ref as unknown as React.Ref<HTMLImageElement>}
        src={src}
        alt={alt}
        data-slot="avatar-image"
        className={cn("aspect-square size-full", className)}
        fill
        sizes="64px"
        onLoad={() => {
          setIsImageLoaded(true)
          onLoadingStatusChange?.("loaded")
        }}
        onError={() => {
          setIsImageLoaded(false)
          onLoadingStatusChange?.("error")
        }}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

// AvatarFallback component
type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const { isImageLoaded } = React.useContext(AvatarContext)

    if (isImageLoaded) {
      return null
    }

    return (
      <div
        ref={ref}
        data-slot="avatar-fallback"
        className={cn(
          "bg-muted flex size-full items-center justify-center rounded-full",
          className
        )}
        {...props}
      />
    )
  }
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
