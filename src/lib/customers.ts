import type { Customer } from "@/types/campaign";

/*
  Clientes FICTÍCIOS para as campanhas (nomes, telefones e emails inventados).
  Para usar clientes de verdade, troque esta lista por uma busca no sistema de origem
  e mantenha o mesmo formato (tipo Customer).
*/
export const CUSTOMERS: Customer[] = [
  { id: "c01", name: "Ana Paula Ferreira", phone: "(27) 99811-2034", email: "ana.ferreira@exemplo.com.br", city: "Vitória", neighborhood: "Jardim Camburi" },
  { id: "c02", name: "Bruno Carvalho", phone: "(27) 99723-4410", email: "bruno.carvalho@exemplo.com.br", city: "Vitória", neighborhood: "Jardim Camburi" },
  { id: "c03", name: "Camila Rocha", phone: "(27) 99654-1187", email: "camila.rocha@exemplo.com.br", city: "Vitória", neighborhood: "Praia do Canto" },
  { id: "c04", name: "Diego Nunes", phone: "(27) 99932-7781", email: "diego.nunes@exemplo.com.br", city: "Vitória", neighborhood: "Praia do Canto" },
  { id: "c05", name: "Eduarda Lima", phone: null, email: "eduarda.lima@exemplo.com.br", city: "Vitória", neighborhood: "Centro" },
  { id: "c06", name: "Fábio Mendes", phone: "(27) 99845-6620", email: "fabio.mendes@exemplo.com.br", city: "Vitória", neighborhood: "Jardim da Penha" },
  { id: "c07", name: "Gabriela Souza", phone: "(27) 99701-3398", email: "gabriela.souza@exemplo.com.br", city: "Vitória", neighborhood: "Jardim da Penha" },
  { id: "c08", name: "Henrique Alves", phone: "(27) 99610-5542", email: "henrique.alves@exemplo.com.br", city: "Vila Velha", neighborhood: "Praia da Costa" },
  { id: "c09", name: "Isabela Martins", phone: "(27) 99877-0915", email: "isabela.martins@exemplo.com.br", city: "Vila Velha", neighborhood: "Praia da Costa" },
  { id: "c10", name: "João Pedro Santos", phone: "(27) 99588-2276", email: "joao.santos@exemplo.com.br", city: "Vila Velha", neighborhood: "Itapuã" },
  { id: "c11", name: "Larissa Gomes", phone: "(27) 99966-4013", email: "larissa.gomes@exemplo.com.br", city: "Vila Velha", neighborhood: "Itapuã" },
  { id: "c12", name: "Marcos Ribeiro", phone: "(27) 99742-8851", email: "marcos.ribeiro@exemplo.com.br", city: "Vila Velha", neighborhood: "Centro" },
  { id: "c13", name: "Natália Barbosa", phone: "(27) 99623-1760", email: "natalia.barbosa@exemplo.com.br", city: "Vila Velha", neighborhood: "Centro" },
  { id: "c14", name: "Otávio Pires", phone: "(27) 99814-9032", email: "otavio.pires@exemplo.com.br", city: "Serra", neighborhood: "Laranjeiras" },
  { id: "c15", name: "Paula Teixeira", phone: "(27) 99537-6624", email: "paula.teixeira@exemplo.com.br", city: "Serra", neighborhood: "Laranjeiras" },
  { id: "c16", name: "Rafael Moreira", phone: null, email: "rafael.moreira@exemplo.com.br", city: "Serra", neighborhood: "Jacaraípe" },
  { id: "c17", name: "Sabrina Costa", phone: "(27) 99788-3145", email: "sabrina.costa@exemplo.com.br", city: "Serra", neighborhood: "Jacaraípe" },
  { id: "c18", name: "Tiago Araújo", phone: "(27) 99690-2287", email: "tiago.araujo@exemplo.com.br", city: "Cariacica", neighborhood: "Campo Grande" },
  { id: "c19", name: "Vanessa Dias", phone: "(27) 99851-7709", email: "vanessa.dias@exemplo.com.br", city: "Cariacica", neighborhood: "Campo Grande" },
  { id: "c20", name: "William Castro", phone: "(27) 99572-4438", email: "william.castro@exemplo.com.br", city: "Cariacica", neighborhood: "Itacibá" },
];

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function listCities(customers: Customer[]): string[] {
  return sortedUnique(customers.map((customer) => customer.city));
}

// Bairros de uma cidade (o mesmo nome de bairro pode existir em cidades diferentes)
export function listNeighborhoods(customers: Customer[], city: string): string[] {
  return sortedUnique(
    customers.filter((customer) => customer.city === city).map((customer) => customer.neighborhood),
  );
}

export interface CustomerFilter {
  // Texto vazio significa "todas" / "todos"
  city: string;
  neighborhood: string;
}

export function filterCustomers(customers: Customer[], filter: CustomerFilter): Customer[] {
  return customers.filter(
    (customer) =>
      (filter.city === "" || customer.city === filter.city) &&
      (filter.neighborhood === "" || customer.neighborhood === filter.neighborhood),
  );
}
