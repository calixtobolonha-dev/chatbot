"use client";

import { useMemo, useState } from "react";
import { filterCustomers, listCities, listNeighborhoods } from "@/lib/customers";
import type { Customer } from "@/types/campaign";

interface CustomerPickerProps {
  customers: Customer[];
  selectedIds: Set<string>;
  onToggle: (customerId: string) => void;
  // Marca vários de uma vez (usado pelo "Selecionar todos filtrados")
  onSelectMany: (customerIds: string[]) => void;
  onClear: () => void;
}

const selectStyle =
  "w-full rounded-xs border border-borda bg-superficie-card px-3 py-2 text-sm text-tinta disabled:cursor-not-allowed disabled:opacity-50";

export function CustomerPicker({ customers, selectedIds, onToggle, onSelectMany, onClear }: CustomerPickerProps) {
  // Texto vazio: sem filtro
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const cities = useMemo(() => listCities(customers), [customers]);
  const neighborhoods = useMemo(() => (city === "" ? [] : listNeighborhoods(customers, city)), [customers, city]);
  const visibleCustomers = useMemo(
    () => filterCustomers(customers, { city, neighborhood }),
    [customers, city, neighborhood],
  );

  const allVisibleSelected =
    visibleCustomers.length > 0 && visibleCustomers.every((customer) => selectedIds.has(customer.id));

  function handleCityChange(nextCity: string) {
    setCity(nextCity);
    // Bairro só faz sentido dentro da cidade escolhida
    setNeighborhood("");
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="filter-city" className="mb-1 block text-xs font-semibold text-tinta-suave">
            Cidade
          </label>
          <select id="filter-city" value={city} onChange={(event) => handleCityChange(event.target.value)} className={selectStyle}>
            <option value="">Todas as cidades</option>
            {cities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-neighborhood" className="mb-1 block text-xs font-semibold text-tinta-suave">
            Bairro
          </label>
          <select
            id="filter-neighborhood"
            value={neighborhood}
            onChange={(event) => setNeighborhood(event.target.value)}
            disabled={city === ""}
            className={selectStyle}
          >
            <option value="">{city === "" ? "Escolha a cidade primeiro" : "Todos os bairros"}</option>
            {neighborhoods.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectMany(visibleCustomers.map((customer) => customer.id))}
          disabled={allVisibleSelected}
          className="rounded-xs border border-borda px-3 py-2 text-sm font-semibold text-tinta transition-colors hover:bg-superficie-suave disabled:cursor-not-allowed disabled:opacity-45"
        >
          Selecionar todos filtrados ({visibleCustomers.length})
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={selectedIds.size === 0}
          className="rounded-xs px-3 py-2 text-sm font-semibold text-tinta-suave transition-colors hover:text-tinta disabled:cursor-not-allowed disabled:opacity-45"
        >
          Limpar seleção
        </button>
        <p aria-live="polite" className="ml-auto text-sm text-tinta-suave">
          <span className="font-semibold text-tinta">{selectedIds.size}</span> de {customers.length} selecionados
        </p>
      </div>

      <ul className="max-h-[28rem] divide-y divide-borda overflow-y-auto rounded-md border border-borda">
        {visibleCustomers.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-tinta-suave">Nenhum cliente com esse filtro.</li>
        )}
        {visibleCustomers.map((customer) => (
          <li key={customer.id}>
            <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-superficie-suave">
              <input
                type="checkbox"
                checked={selectedIds.has(customer.id)}
                onChange={() => onToggle(customer.id)}
                className="h-4 w-4 shrink-0 accent-roxo"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-tinta">{customer.name}</span>
                <span className="block truncate text-xs text-tinta-suave">
                  {customer.neighborhood}, {customer.city}
                </span>
              </span>
              {customer.phone ? (
                <span className="shrink-0 font-mono text-xs text-tinta-suave">{customer.phone}</span>
              ) : (
                <span className="shrink-0 text-xs text-perigo">Sem telefone</span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
