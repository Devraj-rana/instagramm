/**
 * Well-Known Security Configuration
 * Helps security researchers and crawlers understand security policies
 */

export default async function handler() {
  return new Response(
    `Contact: security@socialinsight.tech
Expires: 2025-03-29T00:00:00.000Z
Preferred-Languages: en
Canonical: https://socialinsight.tech/.well-known/security.txt
Policy: https://socialinsight.tech/privacy
Acknowledgments: https://socialinsight.tech/support
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
