import { INEO } from './data.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

export class State {
  private initialState: INEO[] = [];
  private prevState: INEO[];
  private state = this.initialState;
  private neoSubject = new BehaviorSubject(this.initialState);
  private errorSubject = new Subject<string>();
  neoStore$ = this.neoSubject.pipe(
    tap(state => this.state = [...state])
  );
  errors$ = this.errorSubject.pipe(
    shareReplay(1)
  );

  constructor() { }

  setNeoList(neoList: INEO[]) {
    this.prevState = this.state;
    this.neoSubject.next(neoList);
    this.dismissError();
  }

  updateNeo(neobj: INEO) {
    this.prevState = this.state;
    const newState = this.state.map((current) => {
      if (current.id === neobj.id) {
        return { ...current, ...neobj };
      }
      return current;
    });
    this.state = newState;
    this.neoSubject.next(this.state);
    this.dismissError();
  }

  stateError(errMsg: string, emitPrevState?: boolean) {
    this.errorSubject.next(errMsg);
    if (emitPrevState) {
      this.neoSubject.next(this.prevState);
    }
  }

  dismissError() {
    this.errorSubject.next(null);
  }

}