import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="space-y-8">
      {/* First Row - 4 Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Total Orders</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              1,234
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              Trending up this month <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">
              Orders for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Total Sales</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              $45,230
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +8.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              Strong sales growth <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">
              Revenue performance
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Net Profit</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              $12,580
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +15.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              Healthy profit margins <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">Profitability trends</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Average Order Value</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              $36.70
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +4.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              AOV increasing steadily <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">Customer spending patterns</div>
          </CardFooter>
        </Card>
      </div>

      {/* Second Row - 4 Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Processing Orders</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              89
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +5.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              Active processing queue <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">
              Orders being processed
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Shipped Orders</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              543
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.8%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              Shipping on track <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">
              Orders in transit
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Delivered Orders</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              1,156
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +18.7%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              Successful deliveries <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">Completed orders</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="font-sans">Failed Orders</CardDescription>
            <CardTitle className="text-2xl font-bold font-sora tabular-nums @[250px]/card:text-3xl">
              23
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -2.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-sans">
            <div className="line-clamp-1 flex gap-2 font-medium font-sans">
              Failure rate decreasing <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground font-sans">Orders requiring attention</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
