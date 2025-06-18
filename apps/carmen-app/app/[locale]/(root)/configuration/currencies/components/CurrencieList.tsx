import { CurrencyDto } from "@/dtos/config.dto";

interface CurrenciesListProps {
  readonly currencies: CurrencyDto[];
}

export default function CurrenciesList({ currencies }: CurrenciesListProps) {
  return (
    <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currencies?.map((currency: CurrencyDto) => (
            <tr key={currency.id}>
              <td>{currency.code}</td>
              <td>{currency.name}</td>
              <td>{currency.symbol}</td>
              <td>{currency.exchange_rate}</td>
              <td>{currency.is_active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}