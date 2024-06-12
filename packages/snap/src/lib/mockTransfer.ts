import { Action,  Asset, Name, Struct, Transaction, TransactionHeader } from "@wharfkit/antelope"
import { Account } from "../models"

class Transfer extends Struct {
  static abiName = "transfer"
  static abiFields = [
    {
      name: "from",
      type: Name,
    },
    {
      name: "to",
      type: Name,
    },
    {
      name: "quantity",
      type: Asset,
    },
    {
      name: "memo",
      type: "string",
    },
  ]
}

export interface TransferParams {
  from: string;
  to: string;
  quantity: string;
  memo?: string;
}

export function makeMockAction(account: Account, transferObject: TransferParams): Action {
    // Generate typed data for action data
  const transfer = Transfer.from(transferObject)

    // Assemble action with action data and metadata
    const action = Action.from({
        authorization: [
            {
                actor: account.name,
                permission: account.permission,
            },
        ],
        account: 'eosio.token',
        name: 'transfer',
        data: transfer,
    })

    return action
}

export function makeMockActions(account: Account, transferObject: TransferParams): Action[] {
    return [makeMockAction(account, transferObject)]
}

export function makeMockTransaction(account: Account, header: TransactionHeader, transferObject: TransferParams): Transaction {
    // Generate array of actions
    const actions = makeMockActions(account, transferObject)
    // Form and return transaction object
    const transaction = Transaction.from({
        ...header,
        actions,
    })
    return transaction
}
