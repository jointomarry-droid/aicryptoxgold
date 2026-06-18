export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">1. Introduction</h2>
              <p className="text-foreground/80 leading-relaxed">
                AI Market Rates ("we", "our", or "us") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">2. Information Collection and Use</h2>
              <p className="text-foreground/80 leading-relaxed">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              <ul className="list-disc list-inside text-foreground/80 space-y-2 mt-3">
                <li>Personal Data: While using our Service, we may ask you to provide us with certain personally identifiable information</li>
                <li>Usage Data: We may also collect information on how the Service is accessed and used</li>
                <li>Cookies: We use cookies and similar tracking technologies to track activity on our Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">3. Use of Data</h2>
              <p className="text-foreground/80 leading-relaxed">
                AI Market Rates uses the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside text-foreground/80 space-y-2 mt-3">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service</li>
                <li>To provide customer support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">4. Security of Data</h2>
              <p className="text-foreground/80 leading-relaxed">
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">5. Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@aimarketrates.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
