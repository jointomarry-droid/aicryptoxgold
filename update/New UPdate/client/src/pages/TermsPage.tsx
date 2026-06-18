export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Terms & Conditions</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">1. Terms</h2>
              <p className="text-foreground/80 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">2. Use License</h2>
              <p className="text-foreground/80 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials (information or software) on AI Market Rates's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-foreground/80 space-y-2 mt-3">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">3. Disclaimer</h2>
              <p className="text-foreground/80 leading-relaxed">
                The materials on AI Market Rates's website are provided on an 'as is' basis. AI Market Rates makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">4. Limitations</h2>
              <p className="text-foreground/80 leading-relaxed">
                In no event shall AI Market Rates or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI Market Rates's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">5. Accuracy of Materials</h2>
              <p className="text-foreground/80 leading-relaxed">
                The materials appearing on AI Market Rates's website could include technical, typographical, or photographic errors. AI Market Rates does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">6. Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at legal@aimarketrates.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
