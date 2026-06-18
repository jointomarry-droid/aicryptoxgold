import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What is cryptocurrency price tracking?',
    answer:
      'Cryptocurrency price tracking is the process of monitoring real-time price changes of digital currencies like Bitcoin and Ethereum. Our platform provides live price updates, historical data, and market analysis to help you make informed trading decisions.',
  },
  {
    question: 'How does AI market analysis work?',
    answer:
      'Our AI market analysis uses machine learning algorithms to process vast amounts of market data, identify patterns, and predict price movements. It analyzes historical trends, trading volumes, sentiment analysis, and other factors to provide actionable insights.',
  },
  {
    question: 'How is gold price calculated?',
    answer:
      'Gold prices are determined by global market demand and supply. We provide real-time gold rates in multiple units (gram, tola, ounce) based on international spot prices, updated throughout the trading day.',
  },
  {
    question: 'How is silver price calculated?',
    answer:
      'Silver prices are calculated similarly to gold, based on global market conditions and trading activity. Our platform displays silver rates in various units with real-time updates from major commodity exchanges.',
  },
  {
    question: 'Is the data updated live?',
    answer:
      'Yes! All our market data is updated in real-time. Cryptocurrency prices update every few seconds, while precious metal rates update throughout the trading day. You can rely on our platform for the most current market information.',
  },
  {
    question: 'Can beginners use this platform?',
    answer:
      'Absolutely! Our platform is designed for both beginners and experienced traders. We provide educational resources, simple interfaces, and detailed explanations to help newcomers understand market dynamics while offering advanced tools for professionals.',
  },
];

export default function FAQSection() {
  return (
    <section className="section-spacing bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-foreground/70">
              Find answers to common questions about our platform and services.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/50 last:border-b-0"
              >
                <AccordionTrigger className="py-4 hover:text-accent transition-colors">
                  <span className="text-left text-foreground font-semibold">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
