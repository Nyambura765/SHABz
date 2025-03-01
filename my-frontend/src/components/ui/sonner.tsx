import React from "react"
import { Toast as Sonner } from "../ui/toast"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Remove the useTheme since we're not using it
  return (
    <Sonner
      className="toaster group"
      {...props}
    />
  )
}

export default Toaster