import { Ticket } from "@/types";
import { Check } from "@phosphor-icons/react";

interface EventTicketsProps {
  tickets: Ticket[];
}

export default function EventTickets({ tickets }: EventTicketsProps) {
  return (
    <div className="w-5/6 2xl:w-2/3 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {tickets.map((ticket, index) => (
        <div key={index} className="bg-color-primary rounded-xl p-8 shadow-md">
          <h2 className="text-color-text text-2xl font-bold mb-2">
            {ticket.type}
          </h2>
          <p className="text-color-text mb-6 text-base">{ticket.description}</p>
          <div className="mb-6">
            <span className="text-color-text text-3xl font-bold">
              ₺{ticket.price}
            </span>
            <span className="text-color-text ml-1 text-sm">TRY</span>
          </div>
          <a
            href={ticket.link}
            className="block w-full text-center bg-color-secondary text-color-background py-4 px-4 rounded-xl border-2 border-color-accent hover:border-color-secondary hover:bg-color-background hover:text-color-text transition-all duration-300 mb-6 text-xl font-medium"
            target="_blank"
            rel="noreferrer"
          >
            Yerini Ayırt
          </a>
          <div className="pt-4">
            {ticket.perks.map((perk, i) => (
              <div
                key={i}
                className="flex items-start border-t border-color-accent py-4 gap-x-4"
              >
                <Check size={20} className="text-color-text shrink-0 mt-0.5" />
                <span className="text-color-text">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
