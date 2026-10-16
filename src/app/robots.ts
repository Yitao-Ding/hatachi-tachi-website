import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// 静的書き出し (output: "export") では force-static が無いとビルドが止まる
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
