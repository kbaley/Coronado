class InvestmentApi {
  static async getAllInvestments() {
    const response = await fetch("api/Investments");
    return response.json();
  }

  static async createInvestment(investment) {
    const response = await fetch('/api/Investments', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(investment)
    });
    return response.json();
  }

  static async updateInvestment(investment) {
    const response = await fetch('/api/Investments/' + investment.investmentId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(investment)
    });
    return response.json();
  }

  static async makeCorrectingEntries() {
    const response = await fetch('/api/Investments/MakeCorrectingEntries', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
}

export default InvestmentApi;