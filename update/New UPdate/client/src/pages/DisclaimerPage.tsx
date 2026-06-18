export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Disclaimer</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">Important Disclaimer</h2>
              <p className="text-foreground/80 leading-relaxed">
                The information provided on AI Market Rates is for informational purposes only and should not be construed as financial advice, investment recommendation, or an offer to buy or sell any security or financial instrument.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">No Financial Advice</h2>
              <p className="text-foreground/80 leading-relaxed">
                AI Market Rates does not provide financial, investment, legal, or tax advice. The content on this website is not intended to be a substitute for professional financial advice. Before making any investment decisions, please consult with a qualified financial advisor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">Market Risks</h2>
              <p className="text-foreground/80 leading-relaxed">
                Cryptocurrency and precious metals markets are highly volatile and subject to significant price fluctuations. Past performance is not indicative of future results. Investing in cryptocurrencies and precious metals carries substantial risk of loss.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">Data Accuracy</h2>
              <p className="text-foreground/80 leading-relaxed">
                While we strive to provide accurate and up-to-date information, AI Market Rates makes no representations or warranties regarding the accuracy, completeness, or reliability of any information on this website. We are not responsible for any errors or omissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">Third-Party Content</h2>
              <p className="text-foreground/80 leading-relaxed">
                This website may contain links to third-party websites. AI Market Rates is not responsible for the content, accuracy, or practices of these external sites. Your use of third-party websites is at your own risk and subject to their terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">Limitation of Liability</h2>
              <p className="text-foreground/80 leading-relaxed">
                In no event shall AI Market Rates be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, whether incurred directly or indirectly, arising from your use of or inability to use the website or its content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about this Disclaimer, please contact us at legal@aimarketrates.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
