import { SiteHeader } from "@/components/site-header"
import { ProductsShowcaseClient } from "@/components/products/ProductsShowcaseClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products Showcase | Dropleather Inc.",
}

export default function ProductsShowcasePage() {
  return (
    <>
      <SiteHeader title="Products Showcase" />
      <div className="flex flex-1 flex-col">
        <ProductsShowcaseClient />
      </div>
    </>
  )
}