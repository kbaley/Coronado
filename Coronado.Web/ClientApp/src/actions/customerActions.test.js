import { loadCustomers } from "./customerActions";
import { LOAD_CUSTOMERS_SUCCESS } from "../constants/customerActionTypes";

describe('customerActions tests', () => {
  const mockCustomers = [{customerId: "123", name: "custId1"}, {customerId: "qwe", name: "custId2"}];

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should load customers', async () => {
  
    // ARRANGE
    const dispatch = jest.fn();
    fetch.mockResponseOnce(JSON.stringify(mockCustomers));

    // ACT
    await loadCustomers()(dispatch)

    // ASSERT
    expect(dispatch).toBeCalledWith({type: LOAD_CUSTOMERS_SUCCESS, invoices: mockCustomers});

  });

});