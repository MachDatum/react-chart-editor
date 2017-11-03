import DropdownWidget from '../widgets/Dropdown';
import React from 'react';
import {TestEditor, fixtures, plotly} from '../../lib/test-utils';
import {mount} from 'enzyme';

function render(overrides = {}) {
  const {attr = 'x', ...props} = overrides;
  const editorProps = {...fixtures.scatter(), onUpdate: jest.fn(), ...props};

  // return the inner-most plot connected dropdown (last)
  return mount(<TestEditor {...editorProps} plotly={plotly} />)
    .find(`[attr="${attr}"]`)
    .last();
}

describe('DataSelector', () => {
  it('contains options defined by dataSources', () => {
    const {dataSources} = fixtures.scatter();
    const wrapper = render({dataSources});
    expect(wrapper.prop('options')).toEqual(Object.keys(dataSources));
  });

  it('sets srcAttr and srcProperty when attr is data_array', () => {
    const wrapper = render();
    expect(wrapper.prop('srcAttr')).toBe('xsrc');
    expect(wrapper.prop('srcProperty').get()).toBe('x1');
  });

  // arrayOk not implemented in defaultEditor yet
  it('sets srcAttr and srcProperty when attr is arrayOk', () => {});

  it('uses srcProperty as fullValue', () => {
    const wrapper = render();
    expect(wrapper.prop('fullValue')()).toBe('x1');
  });

  it('calls updatePlot with srcAttr', () => {
    const onUpdate = jest.fn();
    const wrapper = render({onUpdate}).find(DropdownWidget);
    wrapper.prop('onChange')('y2');
    expect(onUpdate.mock.calls[0][1]).toEqual({xsrc: ['y2']});
  });

  it('is invisible when a data src does not exist for trace type', () => {
    let wrapper = render().find(DropdownWidget);
    expect(wrapper.exists()).toBe(true);

    wrapper = render({...fixtures.pie(), attr: 'x'}).find(DropdownWidget);
    expect(wrapper.exists()).toBe(false);
  });
});