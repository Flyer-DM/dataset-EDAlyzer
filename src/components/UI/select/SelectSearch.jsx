import Select from 'react-select';

const SelectSearch = ({ options, value, onChange }) => {
    const selectOptions = options.map(opt => ({ label: opt, value: opt }));

    const selectedOption = selectOptions.find(opt => opt.value === value) || null;

    return (
        <div style={{ marginBottom: 15 }}>
            <Select
                options={selectOptions}
                value={selectedOption}
                onChange={(selected) => onChange(selected.value)}
                placeholder="Поиск..."
                isSearchable
                maxMenuHeight={200}
                styles={{
                    container: base => ({ ...base, width: '100%' }),
                    menu: base => ({ ...base, zIndex: 100 }),
                    control: base => ({
                        ...base,
                        borderRadius: 4,
                        minHeight: 36,
                        fontSize: 14,
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
                        color: 'black',
                        padding: '8px 12px',
                        fontSize: 14,
                        cursor: 'pointer',
                    }),
                }}
            />
        </div>
    );
};

export default SelectSearch;