import { loadInvoices } from "./invoiceActions";
import { LOAD_INVOICES_SUCCESS } from "../constants/invoiceActionTypes";

describe('invoiceActions tests', () => {
  const mockInvoices = [{invoiceId: "123", customerId: "custId1"}, {invoiceId: "qwe", customerId: "custId2"}];

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should load invoices', async () => {
  
    // ARRANGE
    const dispatch = jest.fn();
    fetch.mockResponseOnce(JSON.stringify(mockInvoices));

    // ACT
    await loadInvoices()(dispatch)

    // ASSERT
    expect(dispatch).toBeCalledWith({type: LOAD_INVOICES_SUCCESS, invoices: mockInvoices});

  });

});